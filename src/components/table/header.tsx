export default function Header({ text }: { text: string }) {
  return (
    <header>
      <h1>{text.toUpperCase()}</h1>
    </header>
  );
}
