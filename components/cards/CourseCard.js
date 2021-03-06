import React from 'react';
import { Card, Badge } from 'antd';
import NextLink from 'next/link';
import { currencyFormatter } from '../../utils/helpers';

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { slug, name, instructor, price, image, paid, category } = course;
  return (
    <NextLink href={`/course/${slug}`}>
      <a>
        <Card
          className="mb-4"
          cover={
            <img
              src={image && image.Location ? image.Location : '/img/course.jpg'}
              alt={name}
              style={{ height: '200px', objectFit: 'cover' }}
              className="p-1"
            />
          }
        >
          <h2 className="font-weight-bold">{name}</h2>
          <Badge
            count={category}
            style={{ backgroundColor: '#03a9f4' }}
            className="pb-2 me-2"
          />
          <h4 className="pt-2">
            {paid
              ? currencyFormatter({
                  lenguageCode: 'en-US',
                  amount: price,
                  currency: 'usd',
                })
              : 'Free'}
          </h4>
          <p>by {instructor.name}</p>
        </Card>
      </a>
    </NextLink>
  );
};

export default CourseCard;
