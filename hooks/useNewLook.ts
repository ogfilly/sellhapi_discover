import { useReducer } from "react";
import type { CreatorModel, FashnCategory, PinnedProduct } from "@/types/garment";

export type NewLookStep = "model" | "garment" | "tryon" | "publish";

export interface NewLookState {
  step:          NewLookStep;
  model:         CreatorModel | null;
  garmentUrl:    string | null;
  garmentLabel:  FashnCategory | null;
  tryOnUrl:      string | null;
  caption:       string;
  products:      PinnedProduct[];
  pendingPin:    { x: number; y: number } | null;
}

type Action =
  | { type: "SET_MODEL";   payload: CreatorModel }
  | { type: "SET_GARMENT"; payload: { url: string; label: FashnCategory } }
  | { type: "SET_TRYON";   payload: string }
  | { type: "SET_CAPTION"; payload: string }
  | { type: "SET_PENDING_PIN"; payload: { x: number; y: number } | null }
  | { type: "ADD_PRODUCT"; payload: PinnedProduct }
  | { type: "REMOVE_PRODUCT"; payload: string }
  | { type: "RETRY_TRYON" }
  | { type: "GO_BACK" };

const STEP_ORDER: NewLookStep[] = ["model", "garment", "tryon", "publish"];

function prevStep(s: NewLookStep): NewLookStep {
  const idx = STEP_ORDER.indexOf(s);
  return idx > 0 ? STEP_ORDER[idx - 1]! : s;
}

const initial: NewLookState = {
  step:         "model",
  model:        null,
  garmentUrl:   null,
  garmentLabel: null,
  tryOnUrl:     null,
  caption:      "",
  products:     [],
  pendingPin:   null,
};

function reducer(state: NewLookState, action: Action): NewLookState {
  switch (action.type) {
    case "SET_MODEL":
      return { ...state, model: action.payload, step: "garment" };
    case "SET_GARMENT":
      return { ...state, garmentUrl: action.payload.url, garmentLabel: action.payload.label, step: "tryon" };
    case "SET_TRYON":
      return { ...state, tryOnUrl: action.payload, step: "publish" };
    case "SET_CAPTION":
      return { ...state, caption: action.payload };
    case "SET_PENDING_PIN":
      return { ...state, pendingPin: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload], pendingPin: null };
    case "REMOVE_PRODUCT":
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case "RETRY_TRYON":
      return { ...state, tryOnUrl: null, step: "tryon" };
    case "GO_BACK":
      return { ...state, step: prevStep(state.step) };
    default:
      return state;
  }
}

export function useNewLook() {
  const [state, dispatch] = useReducer(reducer, initial);
  return { state, dispatch };
}
