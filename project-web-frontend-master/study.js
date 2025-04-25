// sidebar
function togglesubmenu(button){
    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate')
    };
    
    function refreshbutton(){
    location.reload();
    
    }
    //end sidebar

    //**************************************************************** */
    
    // كبسة اختيار التخصص

    function toggleDropdown() {
        var dropdownContent = document.querySelector('.dropdown-content');
        
        // التبديل بين إظهار وإخفاء القائمة المنسدلة
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    }

    //
    
    
    /////////////////////جلب اليوزر من الداتا/////////////////////////
    const userId = localStorage.getItem('userId');
    console.log(userId);
    //////////////////////////////////////////////


    /////////////لإضافة الوظيفة لزر الـ "chat"///////////////

    document.addEventListener('DOMContentLoaded', () => {
        const chatButton = document.querySelector('.chat-button');
    
        chatButton.addEventListener('click', () => {
            alert('Starting chat with Aevar...'); // يمكن تغيير هذه الوظيفة حسب الحاجة
        });
    });

    
    ////////////////////تخزين البيانات واعداد العناصر////////////////////
        document.addEventListener('DOMContentLoaded', () => {
            // الحصول على العناصر
            const chatButton = document.querySelector('.chat-button');
            const majorElement = document.querySelector('.major');
            const userElement = document.querySelector('.user');
            const descriptionElement = document.querySelector('.Description');
            const userIcon = document.querySelector('.Usericon img');
            const posts = []; // مصفوفة لتخزين المنشورات

     //احضار اسم وemail المستخدم الحالي وح
    const renderUserDetails = async () => {
            const response = await fetch(`https://localhost:7259/api/User/id?id=${userId}`);
            const userData = await response.json();
            document.getElementById('p-email').textContent=userData.email;
            document.getElementById('p-username').textContent=userData.name;
    };
    renderUserDetails();
    ///////////////////////////////////////
    

    ////////////عرض المنشورات////////////
    let allPosts = [];  // مصفوفة لتخزين جميع المنتجات
    const postsList = document.getElementById('postsList'); // حاوية المنتجات
    const filterButtons = document.querySelectorAll('.filter-btn'); // جميع أزرار التصفية
    

    //////////////////////////////////////
    // دالة لعرض المنتجات المضافة من الـ API
    const renderPosts = async () => {
        postsList.innerHTML = ''; // تفريغ المحتوى الحالي
    
        try {
            // جلب جميع المنتجات من الـ API مرة واحدة
            const response = await fetch('https://localhost:7259/api/Product');
            allPosts = await response.json(); // تخزين جميع المنتجات في الذاكرة
    
            // عرض جميع المنتجات عند تحميل الصفحة
            displayPosts(allPosts); // عرض المنتجات
        } catch (error) {
            console.error('Error fetching products:', error.message);
            alert('حدث خطأ أثناء استرجاع المنتجات');
        }
    };

//////////////////////////////

// دالة لعرض البطاقة باستخدام بيانات المستخدم
const renderCard = (user) => {
    const postsList = document.getElementById('postsList'); // حاوية المنتجات

    // إنشاء عنصر جديد لتمثيل البطاقة
    const postElement = document.createElement('div');
    postElement.className = 'card-study'; // إضافة الكلاس الخاص بالكارد

   

    // إضافة البطاقة إلى حاوية المنشورات
    postsList.appendChild(postElement);

    // إضافة وظيفة عند الضغط على زر "chat"
    const chatButton = postElement.querySelector('.chat-button');
    chatButton.addEventListener('click', () => {
        alert(`بدأت محادثة مع ${user.username || 'المستخدم'}`); // رسالة عند الضغط على زر chat
    });
};

// مثال على كيفية استدعاء الدالة لعرض بطاقة مستخدم
const sampleUser = {
    profileImage: 'صورة لينكدان.jpg',
    major: 'CIS',
    username: 'Aevar',
    description: 'وصف المستخدم هنا.',
};
 // تعيين المحتوى داخل البطاقة باستخدام بيانات المستخدم
 postElement.innerHTML = `
 <div class="imge">
     <div class="Usericon">
         <img src="${user.profileImage || 'صورة لينكدان.jpg'}" alt="no picture">
     </div>
     <p class="major">${user.major || ''}</p>
     <p class="user">${user.username || ''}</p>
 </div>

 <div class="Description">${user.description || ''}</div>

 <div>
     <button class="chat-button">chat</button>
 </div>
`;

renderCard(sampleUser); // استدعاء الدالة لعرض البطاقة



///////////////////////////////////////////////////////


    // دالة لعرض المنتجات
    const displayPosts = (posts) => {
        postsList.innerHTML = ''; // تفريغ المحتوى الحالي
        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.className = 'card-study'; // استخدام الكلاس الخاص بالكارد
    
            postElement.innerHTML = `
                <div class="imge">
                    <div class="Usericon">
                        <img src="${post.profileImage || 'صورة لينكدان.jpg'}" alt="no picthur">
                    </div>
                    <p class="major">${post.major || 'CIS'}</p>
                    <p class="user">${post.username || 'Aevar'}</p>
                </div>
    
                <div class="Description">${post.description || 'sssssssssssssss'}</div>
    
                <div>
                    <button class="chat-button">chat</button>
                </div>
            `;
              
            postsList.appendChild(postElement);
         
        });
    };
    /////////////////////////////////////////////////////////
    
    
     
    // استدعاء الدالة عند تحميل الصفحة
    renderPosts();
    
    ////////////////////////////////
    // عند إضافة المنتج، نقوم بتحديث عرض المنتجات
           
        modalPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const formData = new FormData();
            formData.append("Name", modalTitleInput.value);
            formData.append("caption", modalDescriptionInput.value);
            formData.append("userId", userId); // استبدل بـ userId الديناميكي
           
            try {
                const response = await fetch("https://localhost:7259/api/Product/add-product", {
                    method: "POST",
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error("Failed to save post.");
                }
    
                const result = await response.json();
                alert("Product created successfully!");
    
                // إعادة تحميل المنتجات بعد إضافة المنتج الجديد
                posts.push(result);
                modalPostForm.reset();
                postModal.hide();
                renderPosts(); // تحديث عرض المنتجات بعد الإضافة
    
            } catch (error) {
                console.error("Error posting data:", error.message);
                alert(`Error: ${error.message}`);
            }
        });
    
    }); 
    
    
    var dropdownBtn = document.querySelector(".dropbtn");
var dropdownContent = document.querySelector(".dropdown-content");

// أضف مستمع حدث للنقر على الزر
dropdownBtn.addEventListener("click", function() {
  // قم بتبديل فئة لإظهار/إخفاء المحتوى
  dropdownContent.classList.toggle("show");
});


// أغلق القائمة المنسدلة إذا نقر المستخدم في أي مكان خارجها
window.addEventListener("click", function(event) {
  if (!event.target.matches('.dropbtn')) {
    if (dropdownContent.classList.contains('show')) {
      dropdownContent.classList.remove('show');
    }
  }
});
