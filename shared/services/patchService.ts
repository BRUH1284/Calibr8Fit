const createJsonPatch = (object: any) => {
  const patch: any[] = [];

  // Include each property as a "replace" operation in the JSON Patch format
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      patch.push({ op: "replace", path: `/${key}`, value: object[key] });
    }
  }

  return patch;
};

export const patchService = { createJsonPatch };
