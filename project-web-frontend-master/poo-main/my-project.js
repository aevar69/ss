        // استهداف جميع أزرار الحذف
        document.addEventListener('DOMContentLoaded', () => {
            const deleteButtons = document.querySelectorAll('.delete-btn');
    
            deleteButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    // تحديد الكارد الأب للزر
                    const card = event.target.closest('.card');
                    if (card) {
                        card.remove(); // حذف الكارد
                    }
                });
            });

            //////////////////////////////////////////////
            const userId = localStorage.getItem('userId');
            console.log(userId);
            fetchUserData(userId);
            fetchUserPosts(userId);
            LikedProducts(userId);
            //////////////////////////////////////////////

        });
        
// sidebar

function togglesubmenu(button){
    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate')
    };
    //end sidebar
    
    

/***********************************************************/    

// دالة لجلب معلومات المستخدم بناءً على userId
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://localhost:7259/api/User/id?id=${userId}`);
        
        if (!response.ok) {
            throw new Error('فشل في جلب البيانات');
        }

        const userData = await response.json();

        // عرض البيانات في العناصر HTML
        document.getElementById('username').innerHTML = `الاسم : ${userData.name}`;
        document.getElementById('email').innerHTML = `البريد الإلكتروني : ${userData.email}`;
        document.getElementById('phone').innerHTML = `رقم الهاتف : ${userData.phone}`;
    
        document.getElementById('modalRegisterForm').innerHTML = ` <div>
                        <label for="modalNameInput">الاسم</label>
                        <input 
                            type="text" 
                            id="modalNameInput"
                            class="form-control" 
                            value=${userData.name}
                            required 
                        >
                    </div>
                    
                    <div class="mt-3">
                        <label for="modalEmailInput">البريد الإلكتروني</label>
                        <input 
                            type="email" 
                            id="modalEmailInput"
                            class="form-control" 
                            value=${userData.email}
                            required 
                        >
                    </div>
                   
                    <div class="mt-3">
                        <label for="modalPhoneInput">رقم الهاتف</label>
                        <input 
                            type="tel" 
                            id="modalPhoneInput"
                            class="form-control" 
                             value=${userData.phone}
                            required 
                        >
                    </div>
                   
                    <button 
                        type="submit" 
                        class="btn btn-success btn-block mt-3"
                    >
                       حفظ
                    </button>`;
        
    } catch (error) {
        console.error('خطأ أثناء جلب البيانات:', error);
    }
}



// إرسال التعديلات إلى الخادم عند حفظ التحديثات
document.getElementById("modalRegisterForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    const userId = localStorage.getItem('userId');
    console.log(userId);

    const updatedData = {
        name: document.getElementById('modalNameInput').value,
        email: document.getElementById('modalEmailInput').value,
        phone: document.getElementById('modalPhoneInput').value
    };
    console.log(userId);

    try {
        const response = await fetch(`https://localhost:7259/api/User/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error("تعذر تحديث بيانات المستخدم");
        }

        alert("تم تحديث المعلومات بنجاح!");
        location.reload(); 
    } catch (error) {
        console.error("خطأ أثناء التحديث:", error);
        alert("حدث خطأ أثناء تحديث بيانات المستخدم.");
    }
});


async function fetchUserPosts(userId) {
    try {
        const response = await fetch(`https://localhost:7259/api/User/id?id=${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user posts");
        }

        const data = await response.json();
        populatePostDivs(data.products,userId);
    } catch (error) {
        console.error("Error fetching posts:", error);
        alert("Error loading posts. Please try again later.");
    }
}

const postsList = document.getElementById('postsList');
// Function to populate posts dynamically in separate divs
function populatePostDivs(posts) {
    postsList.innerHTML = ''; 
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
                    <h6 style="color:#d2d2d2;" class="card-title">${post.name}</h6>
                    <p rows="5" cols="30" class="card-text">${post.caption}</p>
                    <p class="text-primary">رقم الهاتف: ${post.pHnum}</p>
                    <p class="text-price">السعر: ${post.price} دينار</p>
                    <p class="text-type">type: ${post.type}</p>


                   <button type="button" class="btn btn-success btnclass-up edit-btn" 
                    data-post-id="${post.id}" 
                    data-bs-toggle="modal" data-bs-target="#postModal">
                        تعديل
                    </button>
                     <button type="button" class="btn btn-danger delete-btn btnclass-del" 
                        data-post-id="${post.id}">
                        حذف
                    </button>
                </div>
            </div>
        `;
        postsList.appendChild(postElement);

        
 // إضافة حدث للحذف
 const deleteButtons = document.querySelectorAll('.delete-btn');
 deleteButtons.forEach(button => {
     button.addEventListener('click', async (e) => {
         const postId = e.target.getAttribute('data-post-id');
         
         // إرسال طلب حذف إلى الـ API
         try {
             const response = await fetch(`https://localhost:7259/api/Product/${postId}`, {
                 method: 'DELETE',
             });

             if (response.ok) {
                 // إذا كان الحذف ناجحًا، احذف العنصر من الـ DOM
                 const postElement = e.target.closest('.post-card');
                 postsList.removeChild(postElement);
                 alert('تم حذف المنتج بنجاح');
             } else {
                 alert('فشل حذف المنتج');
             }
         } catch (error) {
             console.error('Error:', error);
             alert('حدث خطأ أثناء الحذف');
         }
     });
 });


         // مستمع حدث لزر التعديل
        const editBtn = postElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const postId = editBtn.getAttribute('data-post-id');
            openEditModal(postId, post);
        });
    });
}



// فتح المودال مع ملء البيانات الحالية للمنشور
function openEditModal(postId, post) {
    // ملء الحقول داخل المودال بالقيم الحالية
    document.getElementById('modalTitleInput').value = post.name;
    document.getElementById('modalDescriptionInput').value = post.caption;
    document.getElementById('modalPriceInput').value = post.price;
    document.getElementById('modalPhoneInput').value = post.pHnum;
    document.getElementById('modalCategoryInput').value = post.type;
    const userId = localStorage.getItem('userId');
    const imageInput = document.getElementById('modalImageInput');
    const imagesContainer = document.getElementById('imagesContainer');
    const selectedImages = []; // مصفوفة لتخزين الصور الجديدة

    // تنظيف الصور القديمة عند فتح المودال
    imagesContainer.innerHTML = '';

    // إضافة الصور القديمة
    if (post.images) {
        post.images.forEach((image) => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageItem.innerHTML = `
                <img src="data:image/${image.contentType};base64,${image.imageBase64}" alt="${image.name}">
                <i class="bi bi-x-circle remove-icon" onclick="removeImage(this)"></i>
            `;
            imagesContainer.appendChild(imageItem);
        });
    }

    // التعامل مع الصور الجديدة
    imageInput.addEventListener('change', () => {
        const files = imageInput.files;

        for (const file of files) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // إنشاء عنصر للصورة الجديدة
                    const imageItem = document.createElement('div');
                    imageItem.classList.add('image-item');
                    imageItem.innerHTML = `
                        <img src="${e.target.result}" alt="Image Preview">
                        <i class="bi bi-x-circle remove-icon" onclick="removeImage(this)"></i>
                    `;
                    imagesContainer.appendChild(imageItem);
                    selectedImages.push(file); // إضافة الصورة الجديدة إلى المصفوفة
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // عند إرسال النموذج يتم تحديث المنشور
    const modalForm = document.getElementById('modalPostForm');
    modalForm.onsubmit = async (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // جمع البيانات الجديدة
        const formData = new FormData();
        formData.append('name', document.getElementById('modalTitleInput').value);
        formData.append('caption', document.getElementById('modalDescriptionInput').value);
        formData.append('price', parseFloat(document.getElementById('modalPriceInput').value));
        formData.append('pHnum', document.getElementById('modalPhoneInput').value);
        formData.append('type', document.getElementById('modalCategoryInput').value);
        formData.append('userId', userId);

       // إضافة الصور الجديدة إلى formData
       selectedImages.forEach((file) => {
        formData.append('images', file);
    });
        // طلب تحديث المنشور إلى API
        try {
            const response = await fetch(`https://localhost:7259/api/Product/${postId}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                alert('تم تعديل المنشور بنجاح.');
                // إعادة تحميل الصفحة
                location.reload();
                // إغلاق المودال
                document.getElementById('postModal').click();
            } else {
                const error = await response.text();
                alert(`خطأ أثناء تعديل المنشور: ${error}`);
            }
        } catch (error) {
            console.error('خطأ أثناء الاتصال بـ API:', error);
            alert('حدث خطأ أثناء تعديل المنشور.');
        }
    }
    
};




async function LikedProducts(userId) {
        const response = await fetch(`https://localhost:7259/api/User/GetLikedProducts/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user posts");
        }
        const data = await response.json();
        addPostDivs(data);
}

const postsListfav = document.getElementById('postsListfav');
// Function to populate posts dynamically in separate divs
function addPostDivs(posts) {
    postsListfav.innerHTML = ''; 
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
                    <h6 style="color:#d2d2d2;" class="card-title">${post.name}</h6>
                    <p rows="5" cols="30" class="card-text">${post.caption}</p>
                    <p class="text-primary">رقم الهاتف: ${post.pHnum}</p>
                    <p class="text-price">السعر: ${post.price} دينار</p>
                    <p class="text-type">type: ${post.type}</p>

                </div>
            </div>
        `;
        postsListfav.appendChild(postElement);
    });
}

