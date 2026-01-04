# Test Checklist for Centre Admin: Aditi Shrivastava

## Prerequisites
- [ ] User exists in database with email (check database)
- [ ] User has `role: "centre_admin"`
- [ ] User has `status: "approved"`
- [ ] User has a valid `centreId` assigned
- [ ] User can log in successfully

## Test 1: Profile Update ✅

### Steps:
1. Log in as Aditi Shrivastava
2. Navigate to Profile page
3. Click "Edit Profile"
4. Update the following fields:
   - Name: "Aditi Shrivastava"
   - Phone: Enter a valid 10-digit phone number
   - Date of Birth: Select a date (e.g., 1990-05-15)
   - Address: Enter an address
   - Aadhar Number: Enter 12-digit Aadhar (optional)

### Expected Results:
- [ ] Age is automatically calculated from DOB
- [ ] Age field is disabled when DOB is provided
- [ ] Date picker shows YYYY-MM-DD format
- [ ] Can save profile successfully
- [ ] Success message: "Profile updated successfully!"
- [ ] Updated data appears in profile view

### API Test:
- [ ] PATCH `/api/users` endpoint responds correctly
- [ ] Date format is normalized to YYYY-MM-DD
- [ ] Age is calculated correctly
- [ ] Profile data is saved to database

---

## Test 2: Patient Creation ✅

### Steps:
1. Navigate to Patients page
2. Click "Add Patient" button
3. Fill in all required fields:
   - Full Name: "Test Patient"
   - Date of Birth: Select a date
   - Gender: Select from dropdown
   - Phone: Enter phone number
   - Address: Enter address
   - Aadhar Number: Enter 12-digit number
   - Email: (optional)
   - Family Contact Name: Enter name
   - Family Contact Phone: Enter phone
   - Addiction Type: Select from dropdown
   - Centre: Should be auto-selected (disabled for centre admin)
   - Admission Date: Select date

### Expected Results:
- [ ] Centre dropdown is disabled and shows assigned centre
- [ ] Helper text shows "Centre is fixed to your assigned centre"
- [ ] Can enter data in all other fields
- [ ] Can submit form successfully
- [ ] Success message: "Patient created successfully!"
- [ ] Patient appears in patients list
- [ ] Patient has correct `centreId` assigned

### API Test:
- [ ] POST `/api/patients` endpoint works
- [ ] `centreId` is automatically set from `currentUser.centreId`
- [ ] Patient is created with correct centre association

---

## Test 3: Query Creation ✅

### Steps:
1. Navigate to Support page
2. Click "Raise Query" button
3. Fill in query form:
   - Centre: Should be auto-selected (disabled for centre admin)
   - Subject: Enter query subject
   - Description: Enter query description
   - Priority: Select priority level

### Expected Results:
- [ ] Centre dropdown is disabled and shows assigned centre
- [ ] Can enter data in Subject, Description, Priority fields
- [ ] Can submit query successfully
- [ ] Success message: "Query submitted successfully!"
- [ ] Query appears in queries list
- [ ] Query has correct `centreId` assigned

### API Test:
- [ ] POST `/api/queries` endpoint works
- [ ] `centreId` is automatically set from `currentUser.centreId`
- [ ] Query is created with correct centre association

---

## Test 4: Centre Update ✅

### Steps:
1. Navigate to Centres page
2. Find the centre assigned to Aditi Shrivastava
3. Click edit button (✏️) on that centre
4. Update editable fields:
   - Centre Name: Can edit
   - City: Can edit
   - Capacity: Can edit
   - Address: Can edit
   - Phone: Can edit
   - Email: Can edit
   - Administrator Name: Can edit
   - Administrator Email: Can edit
   - Status: Can edit

### Expected Results:
- [ ] State field is disabled (with helper text explaining why)
- [ ] Can edit all other fields
- [ ] Can save changes successfully
- [ ] Success message: "Centre updated successfully!"
- [ ] Updated data appears in centre details

### API Test:
- [ ] PUT `/api/centres` endpoint works
- [ ] Centre admin can only update their own centre
- [ ] State field cannot be changed (backend validation)
- [ ] Other fields are updated correctly

---

## Test 5: Patient Editing ✅

### Steps:
1. Navigate to Patients page
2. Find a patient from Aditi's centre
3. Click edit button
4. Update patient information
5. Save changes

### Expected Results:
- [ ] Can edit patient details
- [ ] Centre field is disabled (cannot change)
- [ ] Can save successfully
- [ ] Updated patient appears in list

---

## Test 6: Query Response ✅

### Steps:
1. Navigate to Support page
2. Find a query from Aditi's centre
3. Click "Respond" button
4. Enter response message
5. Submit response

### Expected Results:
- [ ] Can respond to queries from own centre
- [ ] Cannot respond to queries from other centres
- [ ] Response is saved successfully
- [ ] Response appears in query details

---

## Common Issues to Check:

### Issue 1: Centre ID Missing
- **Symptom**: Error "Centre ID not found. Please contact support."
- **Solution**: Ensure user has `centreId` set in database
- **Check**: Verify in database: `users.centreId` is not null

### Issue 2: Form Fields Disabled
- **Symptom**: Cannot type in input fields
- **Solution**: Check browser console for errors
- **Check**: Verify form is not in read-only mode

### Issue 3: Date Format Error
- **Symptom**: "Invalid date format" error
- **Solution**: Ensure date picker uses YYYY-MM-DD format
- **Check**: Date input should auto-format correctly

### Issue 4: Profile Update Fails
- **Symptom**: Profile update shows error
- **Solution**: Verify PATCH handler exists in `/api/users/route.ts`
- **Check**: Ensure date format is YYYY-MM-DD

---

## Database Verification Queries

### Check User Exists:
```javascript
db.users.findOne({ 
  $or: [
    { email: /aditi/i },
    { name: /aditi/i }
  ]
})
```

### Check Centre Assignment:
```javascript
db.users.findOne({ 
  email: "aditi@example.com" // Replace with actual email
}, { centreId: 1, name: 1, role: 1, status: 1 })
```

### Check Centre Details:
```javascript
db.centres.findOne({ 
  id: "C001" // Replace with Aditi's centreId
})
```

---

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Profile Update | ⬜ | |
| Patient Creation | ⬜ | |
| Query Creation | ⬜ | |
| Centre Update | ⬜ | |
| Patient Editing | ⬜ | |
| Query Response | ⬜ | |

---

## Notes:
- All forms should allow data entry except where explicitly disabled (Centre dropdown, State field)
- All API endpoints should work correctly for centre admin role
- Centre admin can only access/modify data from their assigned centre
- Profile updates should work with automatic age calculation

