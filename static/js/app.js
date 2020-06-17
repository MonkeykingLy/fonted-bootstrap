// 整个程序都是用jquery写的，测试前别忘了把jquery文件放到指定文件夹下
$(document).ready(function() {
    var item, title, author, publisher, booklink, bookImg
    var outputlist = document.getElementById('list-output')
        // 这个地址是google给的访问地址
    var bookUrl = "https://www.googleapis.com/books/v1/volumes?q="
    var placeHldr = "<img src='https://via.placeholder.com/150'>"
    var searchData;

    // 给按钮添加事件
    $('#search').click(function() {
        outputlist.innerHTML = ""
        searchData = $('#search-box').val();
        // 获取input的value值，也就是搜索关键词
        if (searchData === "" || searchData === null) {
            displayError();
        } else {
            // 核心的ajax部分，向刚才的google给的地址发送请求
            $.ajax({
                url: bookUrl + searchData,
                // 数据类型为json
                dataType: "json",
                // 如果成功，就是status是200
                success: function(res) {
                    console.log(res);
                    console.log(res.totalItems);
                    // 返回值是一个庞大的object，通过判断object的totalItems的数量来进行后续的事件
                    if (res.totalItems === 0) {
                        alert("no result! try again");
                    } else {
                        // 这里就意味着有返回值，并且能搜到相应的书籍信息
                        console.log("i'm in!");
                        $("#title").animate({ 'margin-top': "5px" }, 1000);
                        // 搜到之后，修改css，使得book-list可见
                        $('.book-list').css('visibility', 'visible');
                        // 调用function相当于排版一下吧
                        displayResults(res);
                    }
                },
                error: function() {
                    // 如果状态码不对，那么弹出对话框，显示错误！
                    alert("something wrong!");
                }

            })
        }
        // $("#search-box").val("");
        // 这个是搜索后清空input栏，我觉得不太好，就给注释掉了
    });

    // 展示function，排版是这样的，一行两个，所以一次获取两组信息
    function displayResults(res) {
        // 根据返回的数据循环遍历
        for (var i = 0; i < res.items.length; i += 2) {
            // 这些信息你可以通过运行程序成功后，查看console来获取
            item = res.items[i];
            title1 = item.volumeInfo.title;
            author1 = item.volumeInfo.authors;
            publisher1 = item.volumeInfo.publisher;
            bookIsbn1 = item.volumeInfo.industryIdentifiers[1].identifier;
            // 简单的判断，图片信息会给两个，就怕有空的，所以判断一下，然后把图片信息放到原先的空位上
            bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;

            item2 = res.items[i + 1];
            title2 = item2.volumeInfo.title;
            author2 = item2.volumeInfo.authors;
            publisher2 = item2.volumeInfo.publisher;
            bookIsbn2 = item2.volumeInfo.industryIdentifiers[1].identifier;
            bookImg2 = (item2.volumeInfo.imageLinks) ? item2.volumeInfo.imageLinks.thumbnail : placeHldr;

            // 把数据插入进去，这是一个html拼接，调用了一个function
            outputlist.innerHTML += '<div class="row mt-4">' +
                formatOutput(bookImg1, title1, author1, publisher1, bookIsbn1) +
                formatOutput(bookImg2, title2, author2, publisher2, bookIsbn2) +
                '</div>';
            console.log(outputlist);

        }
    }
    // 把我们需要输出的信息，format一下，这里还是html拼接，注意 这个``符号，不是引号
    function formatOutput(bookImg, title, author, publisher, bookIsbn) {
        var viewerUrl = 'book.html?isbn=' + bookIsbn;
        var htmlCard = `<div class="col-lg-6"> 
                        <div class = "row no-gutters" >
                            <div class = "col-md-4" > 
                                <img src="${bookImg}" class="card-img" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text">${author}</p>
                                    <p class="card-text">${publisher}</p>
                                    <a target="_blank" href="#" class="btn btn-secondary">Add to</a>
                                </div>
                            </div> 
                        </div> 
                    </div>`
        return htmlCard;
    }

    function displayError() {
        alert("search item cannot be empty!");
    }
})