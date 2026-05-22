import React, { useEffect } from "react";

export type LocationSelection = {
  name: string;
  arName: string;
  id: any;
};

export const EMPTY_LOCATION: LocationSelection = { name: "", arName: "", id: "" };

export const isLocationSelected = (location: LocationSelection) =>
  typeof location?.id !== "string" && location?.id !== "" && location?.id != null;

export const isAreaInList = (areaId: any, areas: { id?: any }[]) =>
  areaId != null &&
  areaId !== "" &&
  areas.some((area) => area.id == areaId);

/** Returns areas only for the given government; never mixes cached data across governments. */
export const resolveAreasForGovernment = (
  areasByCountryId: Record<string | number, any[] | undefined>,
  governmentId: any,
  loadingAreasCountryId: any,
): { areas: any[]; isLoading: boolean } => {
  if (governmentId == null || governmentId === "") {
    return { areas: [], isLoading: false };
  }

  const isLoading = loadingAreasCountryId == governmentId;
  const cached = areasByCountryId[governmentId];

  if (cached) {
    return { areas: cached, isLoading };
  }

  return { areas: [], isLoading };
};

export const canShowAreaDropdown = (
  areasByCountryId: Record<string | number, any[] | undefined>,
  governmentId: any,
  loadingAreasCountryId: any,
) => {
  const { areas, isLoading } = resolveAreasForGovernment(
    areasByCountryId,
    governmentId,
    loadingAreasCountryId,
  );
  return { areas, isLoading, canOpen: !isLoading && areas.length > 0 };
};

type GovernmentSelectArgs = {
  val: LocationSelection;
  prevCityId: any;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, message?: string) => void;
  getAreas: (id: number) => void;
  onCityChanged?: () => void;
};

export const onGovernmentSelected = ({
  val,
  prevCityId,
  setFieldValue,
  setFieldError,
  getAreas,
  onCityChanged,
}: GovernmentSelectArgs):
  | { government: LocationSelection; cityChanged: boolean; clearArea: boolean }
  | "invalid" => {
  if (typeof val?.id === "string") {
    setFieldError("City", "You must pick a city!");
    return "invalid";
  }

  const cityChanged = prevCityId != val.id;
  setFieldValue("City", val.id);

  if (cityChanged) {
    setFieldValue("Area", "");
    onCityChanged?.();
  }

  getAreas(Number(val.id));

  return { government: val, cityChanged, clearArea: cityChanged };
};

type AreaSelectArgs = {
  val: LocationSelection;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, message?: string) => void;
};

export const onAreaSelected = ({
  val,
  setFieldValue,
  setFieldError,
}: AreaSelectArgs): LocationSelection | "invalid" => {
  if (typeof val?.id === "string") {
    setFieldError("Area", "You must pick a area!");
    return "invalid";
  }

  setFieldValue("Area", val.id);
  return val;
};

type SyncAreaSelectionProps = {
  areaId: any;
  areas: { id?: any }[];
  setFieldValue: (field: string, value: any) => void;
  setSharedState?: React.Dispatch<React.SetStateAction<any>>;
  setLocalState?: React.Dispatch<React.SetStateAction<any>>;
};

/** Clears Formik area (and optional UI selection) when it is not in the loaded areas list. */
export const SyncAreaSelection = React.memo(function SyncAreaSelection({
  areaId,
  areas,
  setFieldValue,
  setSharedState,
  setLocalState,
}: SyncAreaSelectionProps) {
  useEffect(() => {
    if (areaId != null && areaId !== "" && areas.length > 0 && !isAreaInList(areaId, areas)) {
      setFieldValue("Area", "");
      setSharedState?.((old) =>
        isLocationSelected(old.selectedArea) ? { ...old, selectedArea: EMPTY_LOCATION } : old
      );
      setLocalState?.((old) =>
        isLocationSelected(old.selectedArea) ? { ...old, selectedArea: EMPTY_LOCATION } : old
      );
    }
  }, [areaId, areas, setFieldValue, setSharedState, setLocalState]);

  return null;
});
