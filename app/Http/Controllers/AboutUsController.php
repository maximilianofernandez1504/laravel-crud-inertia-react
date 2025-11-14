<?php

namespace App\Http\Controllers;

use App\Models\AboutUs;
use App\Models\ImageVideoAboutUs;
use App\Models\AboutUsUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AboutUsController extends Controller
{
    public function index()
    {
        $about = AboutUs::with(['media' => fn($q) => $q->orderBy('priority','asc'), 'urls'])->first();
        if (!$about) {
            $about = AboutUs::create([
                'title' => 'Sobre nosotros',
                'subtitle' => 'Somos...',
                'content' => 'Somos...',
                'footer_text' => 'Muchas gracias por leer...',
            ]);
        }

        return Inertia::render('AboutUs/Index', [
            'about' => $about->toArray(),
        ]);
    }

  
    public function edit()
    {
       
        $about = AboutUs::with(['media' => fn($q) => $q->orderBy('priority','asc'), 'urls'])->firstOrFail();

        return Inertia::render('AboutUs/Edit', [
            'about' => $about,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'footer_text' => 'nullable|string',
            'uploaded_files.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4,mov,webm|max:51200',
            'carousel_ids' => 'nullable|array',
            'remove_media_ids' => 'nullable|array',
            'urls' => 'nullable|array',
            'urls.*.id' => 'nullable|integer|exists:about_us_urls,id',
            'urls.*.url' => 'required_with:urls|url',
            'urls.*.title' => 'nullable|string|max:255',
        ]);

        $about = AboutUs::firstOrFail();


        $about->update([
            'title' => $request->input('title', $about->title),
            'subtitle' => $request->input('subtitle', $about->subtitle),
            'content' => $request->input('content', $about->content),
            'footer_text' => $request->input('footer_text', $about->footer_text),
        ]);

      
        $removeIds = $request->input('remove_media_ids', []);
        if (!empty($removeIds)) {
            $toRemove = ImageVideoAboutUs::whereIn('id', $removeIds)->get();
            foreach ($toRemove as $m) {
          
                $diskPath = Str::after($m->file_path, 'storage/');
                if ($diskPath && Storage::disk('public')->exists($diskPath)) {
                    Storage::disk('public')->delete($diskPath);
                }
                $m->delete();
            }
        }

      
        if ($request->hasFile('uploaded_files')) {
            foreach ($request->file('uploaded_files') as $file) {
                $path = $file->store('images_videos', 'public'); 
                $fullPath = 'storage/app/public/' . $path; 
                $mime = $file->getMimeType();
                $type = str_starts_with($mime, 'video') ? 'video' : 'image';
                $priority = ImageVideoAboutUs::where('about_us_id', $about->id)->max('priority') ?: 0;
                ImageVideoAboutUs::create([
                    'about_us_id' => $about->id,
                    'file_path' => $fullPath,
                    'file_type' => $type,
                    'is_in_carousel' => false,
                    'priority' => $priority + 1,
                ]);
            }
        }

        // set which media are in carousel
        $carouselIds = $request->input('carousel_ids', []);
        if (is_array($carouselIds)) {
            // reset all
            ImageVideoAboutUs::where('about_us_id', $about->id)->update(['is_in_carousel' => false]);
            // set chosen ones
            ImageVideoAboutUs::whereIn('id', $carouselIds)->where('about_us_id', $about->id)->update(['is_in_carousel' => true]);
        }

        // sync urls: simple approach - update existing, create new, delete missing sent ids
        $incomingUrls = $request->input('urls', []);
        $incomingIds = collect($incomingUrls)->pluck('id')->filter()->toArray();

        // delete urls that weren't included and belong to this about
        AboutUsUrl::where('about_us_id', $about->id)->whereNotIn('id', $incomingIds)->delete();

        foreach ($incomingUrls as $u) {
            if (!empty($u['id'])) {
                // update
                AboutUsUrl::where('id', $u['id'])->update([
                    'url' => $u['url'],
                    'title' => $u['title'] ?? null,
                ]);
            } else {
                // create
                AboutUsUrl::create([
                    'about_us_id' => $about->id,
                    'url' => $u['url'],
                    'title' => $u['title'] ?? null,
                ]);
            }
        }

        return redirect()->route('aboutus.index')->with('success', 'Página actualizada correctamente.');
    }

    public function deleteMedia($id)
    {
        $media = ImageVideoAboutUs::findOrFail($id);
        $diskPath = Str::after($media->file_path, 'storage/');
        if ($diskPath && Storage::disk('public')->exists($diskPath)) {
            Storage::disk('public')->delete($diskPath);
        }
        $media->delete();

        return back()->with('success', 'Media eliminada.');
    }
}
