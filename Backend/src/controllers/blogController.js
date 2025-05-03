const db = require("../config/db");
const ogs = require("open-graph-scraper");

exports.getAllBlogs = async (req, res) => {
  const [rows] = await db.promise().query("SELECT * FROM blog_articles ORDER BY created_at DESC");
  res.json(rows);
};

exports.addBlog = async (req, res) => {
  const { url, title } = req.body;

  try {
    const options = {
      url,
      timeout: 10000, // more time to scrape
      headers: {
        'user-agent': 'Mozilla/5.0 (Node scraper)'
      }
    };

    const { result } = await ogs(options);
    console.log("OG RESULT:", result); // ✅ Add this to debug

    const image = result.ogImage?.url || (
      Array.isArray(result.ogImage) ? result.ogImage[0]?.url : null
    );

    await db.promise().query(
      "INSERT INTO blog_articles (url, title, image) VALUES (?, ?, ?)",
      [url, title, image]
    );

    res.json({ message: "Article added with image", image });
  } catch (error) {
    console.error("Error scraping article:", error.message);
    res.status(500).json({ error: "Failed to fetch article metadata." });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query("DELETE FROM blog_articles WHERE id = ?", [id]);
    res.json({ message: "Article deleted" });
  } catch (error) {
    console.error("Error deleting article:", error.message);
    res.status(500).json({ error: "Failed to delete article" });
  }
};
