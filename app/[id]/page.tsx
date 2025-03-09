import React from "react";

type moviePageProps = {
  params: { id: string };
};

const moviePage = ({ params }: moviePageProps) => {
  const { id } = params;

  const movie = {}

  return <div>moviePage</div>;
};

export default moviePage;
