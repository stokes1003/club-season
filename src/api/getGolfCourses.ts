const GOLF_API_BASE_URL = "https://api.golfcourseapi.com/v1";
const GOLF_API_KEY = "VNBQL2XFEX2VRA44O7CHFHJQA4";

const headers = {
  Authorization: `Key ${GOLF_API_KEY}`,
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
