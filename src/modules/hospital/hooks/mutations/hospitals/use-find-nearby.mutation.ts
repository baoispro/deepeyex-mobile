import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ListNearbyHospitalsResponse } from "../../../types/response";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";

type Params = {
  lat: number;
  lng: number;
  radiusKm: number;
};

type Options = Omit<UseMutationOptions<ListNearbyHospitalsResponse, Error, Params>, "mutationFn">;

function useFindHospitalByNearbyMutation(options?: Options) {
  return useMutation<ListNearbyHospitalsResponse, Error, Params>({
    mutationFn: ({ lat, lng, radiusKm }) => HospitalApi.findNearby(lat, lng, radiusKm),
    ...options,
  });
}

export { useFindHospitalByNearbyMutation };
