// JavaScript functions for the Admin Panel and Create Employee Page

// Login form validation
function validateLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'nemani' && password === 'nemani') {
        showAdminPanel(username); 
        return false; // Prevent form submission
    } else {
        alert('Invalid username or password');
        return false; // Prevent form submission
    }
}

// Display the Admin Panel after successful login
function showAdminPanel(username) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    // Display the username in the navbar
    document.getElementById('adminName').textContent = username;
}

// Function to switch between pages in the Admin Panel
function navigateToDashboard() {
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('employeeListPage').style.display = 'none';
    document.getElementById('createEmployeePage').style.display = 'none';
}

// Function to display the Create Employee page
function showCreateEmployee() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('employeeListPage').style.display = 'none';
    document.getElementById('createEmployeePage').style.display = 'block';
}

// Function to display the Employee List page
function showEmployeeList() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('employeeListPage').style.display = 'block';
    document.getElementById('createEmployeePage').style.display = 'none';
    updateEmployeeTable(); // Update employee table when switching to the Employee List page
}

// Function to close the Create Employee form
function closeCreateEmployeeForm() {
    document.getElementById('createEmployeePage').style.display = 'none';
}

// Function to logout and display the login page
function logout() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// JavaScript for form validation and data storage
document.getElementById("submitBtn").addEventListener("click", function() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var mobile = document.getElementById("mobile").value.trim();
    var designation = document.getElementById("designation").value.trim();
    var gender = document.querySelector('input[name="gender"]:checked');
    var course = document.querySelectorAll('input[name="course"]:checked');
    var imgUpload = document.getElementById("imgUpload").files[0];

    // Perform form validation
    if (name === "" || email === "" || mobile === "" || designation === "" || !gender || course.length === 0 || !imgUpload) {
        alert("Please fill in all fields");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Validate mobile number format
    if (!validateMobile(mobile)) {
        alert("Please enter a valid mobile number");
        return;
    }

    // Save image file locally
    var reader = new FileReader();
    reader.onload = function(e) {
        // Store form data in local storage along with the image path
        var formData = {
            "name": name,
            "email": email,
            "mobile": mobile,
            "designation": designation,
            "gender": gender.value,
            "courses": Array.from(course).map(c => c.value),
            "imgUpload": e.target.result // Use FileReader result as image path
        };

        // Retrieve existing data from local storage
        var existingData = JSON.parse(localStorage.getItem("employeeData")) || [];

        // Check for duplicate email
        if (isDuplicateEmail(existingData, email)) {
            alert("Email already exists");
            return;
        }

        // Append new data to existing data
        existingData.push(formData);

        // Store updated data in local storage
        localStorage.setItem("employeeData", JSON.stringify(existingData));

        // Reset form fields
        document.getElementById("employeeForm").reset();

        // Update employee table
        updateEmployeeTable();

        alert("Form submitted successfully!");
    };
    reader.readAsDataURL(imgUpload);
});

// Function to validate email format
function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate mobile number format
function validateMobile(mobile) {
    var mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
}

// Function to check for duplicate email
function isDuplicateEmail(data, email) {
    return data.some(item => item.email === email);
}

// Function to delete an employee entry
function deleteEmployee(index) {
    var employeeData = JSON.parse(localStorage.getItem("employeeData"));

    if (employeeData && employeeData.length > index) {
        employeeData.splice(index, 1);
        localStorage.setItem("employeeData", JSON.stringify(employeeData));
        updateEmployeeTable(); // Update employee table after deleting an employee
    }
}

// Function to update the Employee List table
// Function to update the Employee List table
function updateEmployeeTable() {
    var employeeData = JSON.parse(localStorage.getItem("employeeData"));

    if (employeeData && employeeData.length > 0) {
        var tableBody = document.getElementById("employeeTableBody");
        tableBody.innerHTML = ""; // Clear existing table rows

        employeeData.forEach(function(employee, index) {
            var row = tableBody.insertRow();
            row.innerHTML = "<td>" + (index + 1) + "</td>" +
                            "<td><img src='" + employee.imgUpload + "' alt='" + employee.name + "'></td>" +
                            "<td>" + employee.name + "</td>" +
                            "<td>" + employee.email + "</td>" +
                            "<td>" + employee.mobile + "</td>" +
                            "<td>" + employee.designation + "</td>" +
                            "<td>" + employee.gender + "</td>" +
                            "<td>" + employee.courses.join(", ") + "</td>" +
                            "<td>" + new Date().toLocaleDateString() + "</td>" +
                            "<td>" +
                                "<button class='edit-button' onclick='editEmployee(" + index + ")'>Edit</button>" +
                                "<button class='delete-button' onclick='deleteEmployee(" + index + ")'>Delete</button>" +
                            "</td>";
        });

        // Update total count
        updateTotalCount();
    } else {
        // If no employee data, reset the total count to 0
        document.getElementById("totalCount").textContent = "Total Count: 0";
    }
}


// Function to close the Employee List page
function closePage() {
    document.getElementById('employeeListPage').style.display = 'none';
}

// JavaScript for retrieving and displaying data from local storage
document.addEventListener("DOMContentLoaded", function() {
    updateEmployeeTable(); // Update employee table on page load
});

// Function to delete an employee entry
function deleteEmployee(index) {
    var employeeData = JSON.parse(localStorage.getItem("employeeData"));

    if (employeeData && employeeData.length > index) {
        employeeData.splice(index, 1);
        localStorage.setItem("employeeData", JSON.stringify(employeeData));
        updateEmployeeTable(); // Update employee table after deleting an employee
    } else {
        console.error("Invalid index or employee data not found.");
    }
}

// Function to update the total count of employees
function updateTotalCount() {
    var employeeData = JSON.parse(localStorage.getItem("employeeData"));
    var totalCountElement = document.getElementById("totalCount");
    
    if (employeeData) {
        totalCountElement.textContent = "Total Count: " + employeeData.length;
    }
}

// Call the function to update the total count on page load
document.addEventListener("DOMContentLoaded", function() {
    updateTotalCount();
});
