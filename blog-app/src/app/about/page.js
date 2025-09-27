import React from 'react'

export default async function Page(params) {
  const blog_id = await params.id
  return (
    <div>
        <h1>About Page</h1>
        <p>Blog ID: {blog_id}</p>
    </div>
  )
}
