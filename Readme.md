1. Get Donations Near a Specific Location
This command retrieves donations near latitude 12.9716 and longitude 77.5946 within a 1000-meter radius.


curl -X GET "http://localhost:5000/api/donations/near?lat=12.9716&lon=77.5946&radius=1000" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzFkMjJiZjc1NTE3OWVkNjBlMzQyOSIsImlhdCI6MTc0MDc2MDA5OSwiZXhwIjoxNzQwODQ2NDk5fQ.gr0fRdVVc9CWk2VlNiFq4Pja_6o6_pfrzDS9jdZMCoY"
2. Update Donation Status
This command updates the status of a donation to "matched".
Replace the donation ID (67c1dd7ab4641649daea0d20) with the actual donation ID you wish to update.


curl -X PUT "http://localhost:5000/api/donations/67c1dd7ab4641649daea0d20" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzFkMjJiZjc1NTE3OWVkNjBlMzQyOSIsImlhdCI6MTc0MDc2MDA5OSwiZXhwIjoxNzQwODQ2NDk5fQ.gr0fRdVVc9CWk2VlNiFq4Pja_6o6_pfrzDS9jdZMCoY" -d "{\"status\":\"matched\"}"

3. Assign a Driver
This command assigns a driver to the donation, updates its status to "picked", and records the pickup time.
Replace the donation ID and driver ID with the actual IDs from your system.


curl -X PUT "http://localhost:5000/api/donations/assign/67c1dd7ab4641649daea0d20" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzFkMjJiZjc1NTE3OWVkNjBlMzQyOSIsImlhdCI6MTc0MDc2MDA5OSwiZXhwIjoxNzQwODQ2NDk5fQ.gr0fRdVVc9CWk2VlNiFq4Pja_6o6_pfrzDS9jdZMCoY" -d "{\"driverId\":\"67c1d22bf755179ed60e3429\"}"
