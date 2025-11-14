<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return Inertia::render('Faq/Index', [
            'faqs' => $faqs,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        Faq::create($request->only('question', 'answer'));

        return redirect()->route('faqs.index')->with('flash', [
            'status' => 'success',
            'message' => 'Pregunta creada correctamente'
        ]);
    }
    public function edit()
    {
        $faqs = Faq::all();
        return Inertia::render('Faq/Edit', [
            'faqs' => $faqs,
        ]);
    }

    public function update(Request $request, Faq $faq)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $faq->update($request->only('question', 'answer'));

        return redirect()->route('faqs.index')->with('flash', [
            'status' => 'success',
            'message' => 'Pregunta actualizada correctamente'
        ]);
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return redirect()->route('faqs.index')->with('flash', [
            'status' => 'success',
            'message' => 'Pregunta eliminada'
        ]);
    }
}
