export const mergeObjectWithoutNull = (destinationObject: any, originObject: any) => {
  Object.keys(originObject).forEach((key) => {
    if (originObject[key]) {
      destinationObject[key] = originObject[key];
    }
  });
};
