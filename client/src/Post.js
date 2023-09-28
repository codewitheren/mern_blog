import { Link } from 'react-router-dom';

export default function Post({ post: { _id, title, summary, image, createdAt, author}}) {
  const createdAtDate = new Date(createdAt);
  const formattedDate = createdAtDate.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
  });

  return (
      <div className="post">
        <Link to={`/post/${_id}`}>
            <img src={`http://localhost:4000/${image}`}/>
        </Link>
        <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
            <p>{summary}</p>
        </Link>
          <div className="post-info">
              <p className='author'>{author.username}</p>
              <p className='date'>{formattedDate}</p>
          </div>
      </div>
    
  );
}