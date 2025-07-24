const GOLF_API_BASE_URL =
  process.env.EXPO_PUBLIC_GOLF_API_BASE_URL || "https://api.golf.com/v1";
const EXPO_PUBLIC_GOLF_API_KEY = process.env.EXPO_PUBLIC_GOLF_API_KEY || "";

const headers = {
  Authorization: `Key ${EXPO_PUBLIC_GOLF_API_KEY}`,
};

export async function searchCourses(searchQuery: string) {
  const response = await fetch(
    `${GOLF_API_BASE_URL}/search?search_query=${encodeURIComponent(
      searchQuery
    )}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

export async function getCourseById(courseId: number) {
  const response = await fetch(`${GOLF_API_BASE_URL}/courses/${courseId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Fetch course failed: ${response.status}`);
  }

  return response.json();
}
