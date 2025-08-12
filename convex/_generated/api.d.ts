/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as brands from "../brands.js";
import type * as championships from "../championships.js";
import type * as events from "../events.js";
import type * as matchTypes from "../matchTypes.js";
import type * as promotions from "../promotions.js";
import type * as seedData from "../seedData.js";
import type * as wrestlers from "../wrestlers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  brands: typeof brands;
  championships: typeof championships;
  events: typeof events;
  matchTypes: typeof matchTypes;
  promotions: typeof promotions;
  seedData: typeof seedData;
  wrestlers: typeof wrestlers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
