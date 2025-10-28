import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { type BreadcrumbItem } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: number;
  name: string;
}

interface PageProps {
  categories: {
    data: Category[];
  };
}



const breadcrumbs: BreadcrumbItem[] = [
  { title: "Categories", href: "/categories" },
];

export default function Index() {
  const { categories } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Link href={route("categories.create")}>
          <Button>Crear Categoría</Button>
        </Link>
      </div>
    {categories.data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow> 
                <TableHead >Nombre de la categoria</TableHead>
                <TableHead >Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.data.map((category) => (
                <TableRow >
                  <TableCell className="font-medium">{category.name}</TableCell>    
                  <TableCell >
                    <Link href={route('categories.edit', category.id)}>
                      <Button className="mb-4">Editar</Button>
                    </Link>
                    <Link href={route('categories.destroy', category.id)} method="delete" >   
                        <Button className="mb-4">
                        Eliminar
                        </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-600 mt-4">No hay categorías registradas.</p>
        )}
      
    </AppLayout>
  );
}
