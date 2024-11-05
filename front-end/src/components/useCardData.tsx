import { useEffect, useState } from "react";
import getCardsData from "./service/getCardsData";

export default function useCardData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getCardsData();
      console.log(data);
      setData(data);
    };
    getData();
  }, []);
  return data;
}
