// Marco común del laboratorio 3D (2026-10-16). Alexander, en Safari: «mientras voy deslizando se
// pone en blanco la pantalla y le quita fluidez». Era el rebote elástico de Safari: en una página que
// no desplaza (los capítulos del cine) la rueda igual empuja el documento y deja ver el fondo blanco
// del body debajo del lienzo. Sin rebote y con el documento oscuro, el lienzo no se mueve nunca.
export default function LayoutLaboratorio({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{"html,body{overscroll-behavior:none;background:#05070d}"}</style>
      {children}
    </>
  );
}
