import { Link } from "@inertiajs/react";

interface Link {
  active: boolean,
  label: string,
  url: string
}

export default function Pagination({links}: {links: Link[]}) {
    return (
        <div className='flex flex-wrap justify-center items-center gap-1'>
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 text-sm rounded border
                                ${link.active ? 'bg-accent-foreground text-white' : 'bg-white text-gray-700'}
                                ${!link.url ? 'opacity-50 pointer-events-none' : 'hover:vbg-gray-100'}`}
                />
            ))}
        </div>
    )
}