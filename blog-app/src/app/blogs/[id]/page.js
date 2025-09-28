import {
  Grid,
  Card,
  CardMedia,
  Box,
  Typography,
  CardContent,
} from "@mui/material";
import Link from "next/link";

export default async function Page({ params }) {
  const { id } = await params; // params önce await edilmeli

  let blog = null;
  try {
    const res = await fetch("http://localhost:3001/api/blogs/" + id);
    if (res.ok) {
      blog = await res.json();
    }
  } catch (err) {
    // fetch başarısızsa sessizce fallback'e devam et
  }

  const posts = [
    { id: "1", title: "First Blog", content: "Content of first blog." },
    { id: "2", title: "Second Blog", content: "Content of second blog." },
  ];

  // Eğer API'den gelmediyse fallback olarak sabit veriyi kullan
  if (!blog) {
    const fallback = posts.find((p) => p.id === id);
    if (fallback) {
      blog = {
        id: fallback.id,
        name: fallback.title,
        description: fallback.content,
        img: null,
      };
    }
  }

  if (!blog) {
    return (
      <div>
        <h1>Blog not found</h1>
        <p>No blog with id: {id}</p>
        <p>
          <Link href="/blogs">Back to Blogs</Link>
        </p>
      </div>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card sx={{ display: "flex", width: "100%" }}>
          {blog.img && (
            <CardMedia
              component="img"
              sx={{ width: "45%" }}
              image={`/img/${blog.img}`}
              alt=""
            />
          )}
          <Box sx={{ flex: 1 }}>
            <CardContent>
              <Typography component="div" variant="h6">
                {blog.name}
              </Typography>
              <Typography component="div" variant="subtitle1">
                {blog.description}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
