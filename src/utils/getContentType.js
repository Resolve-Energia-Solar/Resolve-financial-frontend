import contentType from "@/services/contentTypeService";

export default async function getContentType(appLabel, model) {
    const result = await contentType.find(appLabel, model);
    console.log(`Debug: Retrieved content type for appLabel: ${appLabel}, model: ${model} - Result:`, result.results);
    if (result.results.length === 0) {
        throw new Error(`Content type not found for app label: ${appLabel}, model: ${model}`);
    }
    console.log(`Debug: Content type ID: ${result.results[0].id}`);
    return result.results[0].id;
}