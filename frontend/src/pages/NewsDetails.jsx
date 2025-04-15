import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewsDetails = () => {
  const { id } = useParams();
  const [newsDetails, setNewsDetails] = useState(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/news/${id}`);
        setNewsDetails(response.data);
      } catch (error) {
        console.error('Error fetching news details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!newsDetails) return <p>News details not found.</p>;

  return (
    <div>
      <h1>{newsDetails.title}</h1>
      <p>{newsDetails.content}</p>
    </div>
  );
};

export default NewsDetails;
