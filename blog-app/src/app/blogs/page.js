import Link from "next/link";
import { Box, Grid, Typography } from "@mui/material";

export default function Page() {
  const posts = [
    { id: "1", title: "First Blog" },
    { id: "2", title: "Second Blog" }, // blogs/2 ikinci blog
  ];

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {posts.map((p) => (
        <Grid
          item
          xs={12}
          key={p.id}
          sx={{ flexBasis: { xs: "100%", sm: "50%" } }}
        >
          <Link href={`/blogs/${p.id}`}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography variant="h6" component="div" gutterBottom>
                {p.title}
              </Typography>
              <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
                {`/blogs/${p.id}`}
              </Typography>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
