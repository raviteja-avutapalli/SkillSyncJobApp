import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const role = sessionStorage.getItem("role"); // or from context/auth
  const isAdmin = role === "admin";

  // Fetch articles
  const fetchBlogs = async () => {
    const res = await fetch("http://localhost:5000/api/blogs");
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Add article
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:5000/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title }),
    });

    const result = await res.json();
    if (res.ok) {
      setUrl("");
      setTitle("");
      fetchBlogs(); // refresh
    } else {
      setError(result.error || "Failed to add article.");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
      {isAdmin && (
  <p className="mb-4 text-sm text-gray-500 italic">
    Only admins can add new articles. Browse below 👇
  </p>
)}
        {isAdmin && (
          <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="Article URL"
              className="border px-3 py-2 rounded"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional Title"
              className="border px-3 py-2 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Article"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <a
              key={blog.id}
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-xl shadow hover:shadow-lg transition block overflow-hidden"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">
                    {blog.title || blog.url}
                  </h2>
                  {isAdmin && (
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        await fetch(
                          `http://localhost:5000/api/blogs/${blog.id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        fetchBlogs();
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default BlogPage;
