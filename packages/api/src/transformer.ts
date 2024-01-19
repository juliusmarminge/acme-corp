import { dinero } from "dinero.js";
import type { Dinero, DineroSnapshot } from "dinero.js";
import superjson from "superjson";

/**
 * TODO: Maybe put this in a shared package that can be safely shared between `api`, `nextjs` and `expo` packages
 */
superjson.registerCustom(
  {
    isApplicable: (val): val is Dinero<number> => {
      try {
        // if this doesn't crash we're kinda sure it's a Dinero instance
        (val as Dinero<number>).calculator.add(1, 2);
        return true;
      } catch {
        return false;
      }
    },
    serialize: (val) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
      return val.toJSON() as any;
    },
    deserialize: (val) => {
      return dinero(val as DineroSnapshot<number>);
    },
  },
  "Dinero",
);

export const transformer = superjson;
