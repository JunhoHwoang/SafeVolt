import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FilterSort = ({ items = [], onFilterSort = () => {} }) => {
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const categories = ["HIGH", "MEDIUM", "LOW"];

  // Handle score change from RadioGroup
  const handleScoreChange = (value) => {
    
    if (value === "option-one") {
      setSelectedScore([0, 20]);
    } else if (value === "option-two") {
      setSelectedScore([20, 40]);
    } else if (value === "option-three") {
      setSelectedScore([40, 60]);
    }
  };

  // Handle category change from Checkbox
  const handleCategoryChange = (checked, category) => {
    setSelectedCategory(checked ? category : null);
  };

  // Handle sort change from Select
  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  // Use useEffect to trigger sorting and filtering whenever any relevant state changes
  useEffect(() => {
    applyFilterSort();
  }, [sortOrder, selectedScore, selectedCategory, items]);

  // Function to filter and sort items
  const applyFilterSort = () => {
    let filteredItems = [...items];

    // Filter by score range if selected
    if (selectedScore) {
      filteredItems = filteredItems.filter((item) => {
        return (
          item.severityScore >= selectedScore[0] &&
          item.severityScore <= selectedScore[1]
        );
      });
    }

    // Filter by category if selected
    if (selectedCategory) {
      filteredItems = filteredItems.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Apply sorting with a fresh copy of the filtered items
    if (sortOrder) {
      filteredItems = filteredItems.slice().sort((a, b) => {
        switch (sortOrder) {
          case "high":
            return b.severityScore - a.severityScore; // Score High to Low
          case "low":
            return a.severityScore - b.severityScore; // Score Low to High
          case "newest":
            return new Date(b.date) - new Date(a.date); // Newest first
          case "oldest":
            return new Date(a.date) - new Date(b.date); // Oldest first
          case "lex":
            return a.overview.localeCompare(b.overview); // A-Z by title
          default:
            return 0;
        }
      });
    }

    // Call the callback function with the filtered and sorted items
    onFilterSort(filteredItems);
  };

  return (
    <div className="flex flex-row items-center space-x-4 mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Filter</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label>Score Range</Label>
              <RadioGroup onValueChange={handleScoreChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">0-20</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">20-40</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">40-60</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Category</Label>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategory === category}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(checked, category)
                    }
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">Score High to Low</SelectItem>
          <SelectItem value="low">Score Low to High</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="lex">A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
