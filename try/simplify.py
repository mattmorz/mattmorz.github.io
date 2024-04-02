import heapq
import json

def simplify_geojson_multipolygon(feature, tolerance):
    # Function to calculate the area of a triangle given its vertices
    def triangle_area(a, b, c):
        return abs((a[0]*(b[1]-c[1]) + b[0]*(c[1]-a[1]) + c[0]*(a[1]-b[1])) / 2.0)
    
    # Function to calculate the importance of a vertex using Visvalingam-Whyatt algorithm
    def calculate_importance(vertices):
        if len(vertices) < 3:
            return float('inf')
        area = triangle_area(vertices[0], vertices[1], vertices[-1])
        for i in range(1, len(vertices) - 1):
            area = min(area, triangle_area(vertices[i], vertices[i+1], vertices[i-1]))
        return area
    
    # Function to simplify a polygon
    def simplify_polygon(coords, tolerance):
        if len(coords) <= 3:
            return coords
        heap = []
        for i in range(1, len(coords) - 1):
            importance = calculate_importance([coords[i-1], coords[i], coords[i+1]])
            heapq.heappush(heap, (importance, i))
        while len(coords) > 4 and heap[0][0] < tolerance:
            _, index = heapq.heappop(heap)
            coords.pop(index)
            if index > 1:
                importance = calculate_importance([coords[index-2], coords[index-1], coords[index]])
                heapq.heappush(heap, (importance, index-1))
            if index < len(coords) - 2:
                importance = calculate_importance([coords[index], coords[index+1], coords[index+2]])
                heapq.heappush(heap, (importance, index+1))
        return coords
    
    # Function to simplify a multipolygon
    def simplify_multipolygon(multipolygon_coords, tolerance):
        simplified_multipolygon = []
        for polygon_coords in multipolygon_coords:
            simplified_polygon_coords = simplify_polygon(polygon_coords, tolerance)
            simplified_multipolygon.append(simplified_polygon_coords)
        return simplified_multipolygon
    
    # Parse GeoJSON feature
    geometry = feature.get('geometry')
    if geometry and geometry.get('type') == 'MultiPolygon':
        coordinates = geometry.get('coordinates')
        simplified_coordinates = simplify_multipolygon(coordinates, tolerance)
        feature['geometry']['coordinates'] = simplified_coordinates
    else:
        raise ValueError("Input feature is not a MultiPolygon GeoJSON feature.")
    
    return feature

# Example usage:
# Load GeoJSON feature from file
with open('caraga.json', 'r') as f:
    geojson_data = json.load(f)

# Simplify GeoJSON feature
simplified_feature = simplify_geojson_multipolygon(geojson_data, tolerance=0.001)

# Save simplified feature to file
with open('caraga1.json', 'w') as f:
    json.dump(simplified_feature, f)
