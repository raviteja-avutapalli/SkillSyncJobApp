import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral pt-16 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full px-0">


        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
