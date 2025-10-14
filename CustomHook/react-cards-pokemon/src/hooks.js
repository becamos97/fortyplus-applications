import { useCallback, useState } from "react";
import axios from "axios";
import { v1 as uuid } from "uuid";

/** useFlip: boolean toggle hook */
export function useFlip(initial = true) {
  const [isFlipped, setIsFlipped] = useState(initial);
  const flip = useCallback(() => setIsFlipped(f => !f), []);
  return [isFlipped, flip];
}

/**
 * useAxios(baseUrl)
 * State = array of past responses. Each push gets a unique {id,...data} so
 * you can add duplicates safely (just like your current code does).
 *
 * Returns: [dataArray, addResource, resetData]
 *   - addResource(): GET(baseUrl)
 *   - addResource("suffix"): GET(baseUrl + "suffix")
 *   - addResource(axiosConfigObj): axios(axiosConfigObj)
 */
export function useAxios(baseUrl) {
  const [data, setData] = useState([]);

  const addResource = useCallback(async (arg) => {
    let config;
    if (typeof arg === "string") {
      config = { url: baseUrl + arg };
    } else if (typeof arg === "object" && arg !== null) {
      config = arg.url ? arg : { ...arg, url: baseUrl };
    } else {
      config = { url: baseUrl };
    }

    const resp = await axios(config);
    // store shape compatible with your current components:
    // PlayingCardList expects resp.cards[0].image; PokeDex expects sprites/name.
    setData(arr => [...arr, { ...resp.data, id: uuid() }]);
    return resp.data;
  }, [baseUrl]);

  const resetData = useCallback(() => setData([]), []);

  return [data, addResource, resetData];
}