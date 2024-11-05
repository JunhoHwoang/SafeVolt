import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import { FadeIn } from "./ui/FadeInComp";
import { Cards } from "./types/Cards";

interface CardListProps {
  cards: Cards[];
}

// Individual Card component
const CardItem: React.FC<Cards> = ({
  overview,
  date,
  description,
  severityScore,
  category,
}) => (
  <Card className="mb-4 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
    <CardHeader className="p-4">
      <CardTitle>{overview}</CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
    <CardFooter className="p-4 flex justify-between items-center">
      <Badge variant="outline" className="mr-2">
        {new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Badge>
      <div className="flex items-center space-x-2">
        <Badge variant={category.toLowerCase() as "low" | "medium" | "high"}>
          {category}
        </Badge>
        <Badge>Score: {severityScore}</Badge>
      </div>
    </CardFooter>
  </Card>
);

// CardList component
export const SafetyCardList: React.FC<CardListProps> = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cards?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col pb-6 w-full">
      {currentItems?.map((card, index) => (
        <FadeIn key={card.id} delay={index * 0.1}>
          <Link
            to={`/card?id=${card.id}&overview=${card.overview}&description=${
              card.description
            }&solution=${card.solution}&severityScore=${
              card.severityScore
            }&datetime=${card.date + " " + card.time}&lesson=${
              card.lesson
            }&prevention=${card.prevention} &category=${card.category}`}
            className="no-underline"
          >
            <CardItem {...card} />
          </Link>
        </FadeIn>
      ))}
      <Pagination
        totalItems={cards?.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
