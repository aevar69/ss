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



//////////////////////////////////////////////
const userId = localStorage.getItem('userId');
console.log(userId);
//////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', () => {
    const modalPostForm = document.getElementById('modalPostForm');
    const modalTitleInput = document.getElementById('modalTitleInput');
    const modalDescriptionInput = document.getElementById('modalDescriptionInput');
    const modalPriceInput = document.getElementById('modalPriceInput');
    const modalPhoneInput = document.getElementById('modalPhoneInput');
    const modalCategoryInput = document.getElementById('modalCategoryInput');
    const modalImageInput = document.getElementById('modalImageInput');
    const postModal = new bootstrap.Modal(document.getElementById('postModal'));
    const posts = []; // مصفوفة لتخزين المنشورات
   
 //احضار اسم وemail المستخدم الحالي وح
const renderUserDetails = async () => {
        const response = await fetch(`https://localhost:7259/api/User/id?id=${userId}`);
        const userData = await response.json();
        document.getElementById('p-email').textContent=userData.email;
        document.getElementById('p-username').textContent=userData.name;
};
renderUserDetails();


let allPosts = [];  // مصفوفة لتخزين جميع المنتجات
const postsList = document.getElementById('postsList'); // حاوية المنتجات
const filterButtons = document.querySelectorAll('.filter-btn'); // جميع أزرار التصفية

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

// دالة لعرض المنتجات
const displayPosts = (posts) => {
    postsList.innerHTML = ''; // تفريغ المحتوى الحالي
    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card card shadow-sm';
        postElement.innerHTML = `
            <div class="body-post row g-0">
                <div class="body-picture col-md-4">
                    <!-- Carousel -->
                    <div id="carousel-${post.id}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${post.images.map((image, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <div class="image-wrapper">
                                        <img src="data:image/${image.contentType};base64,${image.imageBase64}" alt="${image.name}" class="d-block w-100 resize-image">
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${post.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${post.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                  <!-- أيقونة القلب لإضافة المنتج إلى المفضلة -->
                    <button class="btn btn-outline-danger favorite-btn" data-product-id="${post.id}">
                        <i class="bi bi-heart"></i>
                    </button>
                    <h6 style="color:#d2d2d2;" class="card-title">${post.name}</h6>
                    <p rows="5" cols="30" class="card-text">${post.caption}</p>
                    <p class="text-primary">رقم الهاتف: ${post.pHnum}</p>
                    <p class="text-price">السعر: ${post.price} دينار</p>
                    <p class="text-type">type: ${post.type}</p>

                </div>
            </div>
        `;
        postsList.appendChild(postElement);
    
    // إضافة مستمع الحدث لزر المفضلة
    const favoriteBtn = postElement.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', async () => {
        const productId = favoriteBtn.getAttribute('data-product-id');

        try {
            const response = await fetch('https://localhost:7259/api/User/ToggleLike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, productId }),
            });

            const message = await response.text();
            if (response.ok) {
                alert(message); // عرض رسالة النجاح
                // تغيير شكل الأيقونة بناءً على الحالة
                const icon = favoriteBtn.querySelector('i');
                icon.classList.toggle('bi-heart-fill'); // الشكل المملوء
                icon.classList.toggle('bi-heart'); // الشكل الفارغ
            } else {
                alert(`خطأ: ${message}`); // عرض رسالة الخطأ
            }
        } catch (error) {
            console.error('خطأ أثناء الاتصال بـ API:', error);
            alert('حدث خطأ أثناء تبديل حالة الإعجاب.');
        }
    });

    });
};


    // تصفية المنتجات عند الضغط على الأزرار
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        // إزالة الكلاس "active" من جميع الأزرار
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // إضافة الكلاس "active" على الزر الذي تم الضغط عليه
        event.target.classList.add('active');
        
        // الحصول على النوع المحدد
        const filterValue = event.target.getAttribute('data-filter');
        
        // تصفية البيانات بناءً على النوع المحدد
        if (filterValue === 'all') {
            displayPosts(allPosts); // عرض جميع المنتجات
        } else {
            const filteredPosts = allPosts.filter(post => post.type === filterValue);
            displayPosts(filteredPosts); // عرض المنتجات التي تطابق النوع المحدد
        }
    });
});

// استدعاء الدالة عند تحميل الصفحة
renderPosts();


// عند إضافة المنتج، نقوم بتحديث عرض المنتجات
       
    modalPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const imageFile = modalImageInput.files[0];
        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("Name", modalTitleInput.value);
        formData.append("caption", modalDescriptionInput.value);
        formData.append("price", modalPriceInput.value);
        formData.append("PHnum", modalPhoneInput.value);
        formData.append("type", modalCategoryInput.value);
        formData.append("userId", userId); // استبدل بـ userId الديناميكي
       // formData.append("images", imageFile);
    
        // إضافة الصور من المصفوفة إلى FormData
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append("images", selectedImages[i]);
        }
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