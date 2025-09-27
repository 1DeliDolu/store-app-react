export default async function Page({ params }) {
  const blog_id = params?.id;

  // Örnek: sunucudan veri çekmek isterseniz
  // const res = await fetch(`https://api.example.com/blogs/${blog_id}`, { cache: 'no-store' });
  // const blog = await res.json();

  return (
    <div>
      <h1>Blog Page</h1>
      <p>Blog ID: {blog_id}</p>
      {/* Eğer blog verisi çektiyseniz: */}
      {/* <h2>{blog.title}</h2>
			<p>{blog.content}</p> */}
    </div>
  );
}
