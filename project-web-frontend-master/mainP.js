const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
});



// signup API : 
async function signup() {
	// جمع القيم من المدخلات
	const name = document.getElementById('u-name').value.trim();
	const email = document.getElementById('u-email').value.trim();
	const password = document.getElementById('u-password').value.trim();
	const phone = document.getElementById('u-phone').value.trim();

	// التحقق من صحة المدخلات
	if (!name || !email || !password || !phone) {
	  alert('All fields are required!');
	  return;
	}

	const data = { name, email, password, phone };
	console.log(data)
	
	try {

		const response = await fetch('https://localhost:7259/api/User', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	  });

	  const result = await response.json();

	  if (response.ok) {
		window.alert("Account created successfully!");
		//////////////////////////////////
 		// إذا كانت بيانات تسجيل الدخول صحيحة، خزن الـ userId في localStorage
		const userId = result.id; 
		localStorage.setItem('userId', userId);
		//////////////////////////////////
		// Redirect to the next page
		window.location.href = 'header.html';

	  } else {
		window.alert("Failed to create");
	  }
	} catch (error) {
	  // معالجة الأخطاء العامة
	 console.log(`An error occurred: ${error.message}</div>`);
	}
  }

  // استماع لحدث تقديم النموذج
  document.getElementById('signupButton').addEventListener('click', function (e) {
	e.preventDefault(); // منع إعادة تحميل الصفحة
	signup(); // استدعاء دالة التسجيل
  });






// Login API...............
const apiUrl = "https://localhost:7259/api/User";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const messageDiv = document.getElementById("message");

async function login() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        messageDiv.textContent = "Please enter both email and password.";
        messageDiv.style.color = "red";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
			    //////////////////////////////////
			   // إذا كانت بيانات تسجيل الدخول صحيحة، خزن الـ userId في localStorage
			   const userId = data.id;
			   localStorage.setItem('userId', userId);  
			   //////////////////////////////////
            alert(`Welcome, ${email}`)
            // Redirect to the next page
		   window.location.href = 'header.html';
        } else {
            alert(data.message || "Login failed.")// 
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

//// تخزين الـ userId في localStorage
loginButton.addEventListener("click", login);

