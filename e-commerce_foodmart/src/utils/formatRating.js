export function formatRating(rating)
{
  const final_rating = `${(Math.round(rating * 100) / 100).toFixed(1)}`;

  if (final_rating > 5.0)
  {
    return ((5.0).toFixed(1));
  }


  return (final_rating);
}
