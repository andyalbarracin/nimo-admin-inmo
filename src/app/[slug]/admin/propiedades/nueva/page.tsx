import { redirect } from 'next/navigation'

// El alta de propiedad ahora vive en el drawer funcional del listado.
export default async function NuevaPropiedadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/${slug}/admin/propiedades?new=1`)
}
