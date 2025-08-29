export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 py-6 text-center shadow-lg">
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-200">Recipe Finder</span> | All rights reserved
      </p>
    </footer>
  );
}
