function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="mb-2">© {new Date().getFullYear()} MyProject. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="https://github.com" className="hover:text-white">GitHub</a>
          <a href="https://linkedin.com" className="hover:text-white">LinkedIn</a>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
