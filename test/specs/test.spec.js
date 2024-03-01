describe("Test suite", () => {

    //Change Email_register and Email_register2 so you don't try to register with an already existing user
    const Email_register = "lily_doe@test.com"
    const Email_register2 = "lily2_doe@test.com";

    const Email_login = "lesly_doe@test.com"
    const Password = "testPassword"

    it("Register", async () => {
        await browser.url("./register");

        //Fill fields: first name, last name, email, password, confirm password
        await $('[name="FirstName"]').setValue('Lesly');
        await $('[name="LastName"]').setValue('Doe');
        await $('[name="Email"]').setValue(Email_register);
        await $('[name="Password"]').setValue(Password);
        await $('[name="ConfirmPassword"]').setValue(Password);

        //Click register button
        await $('[name="register-button"]').click();

        //Check that we successfully registered
        const register_completed = await $("div.result");
        await expect(await register_completed.getText()).toEqual("Your registration completed");

        //Open Customer info page and change email so the firefox run doesn't try to register an existing user
        const email_link = await $("div.header-links > ul >li a.account");
        const save_button = await $('[value="Save"]');

        await expect(await email_link.getText()).toEqual(Email_register);
        await email_link.click()
        await save_button.waitForDisplayed();
        await $('[name="Email"]').setValue(Email_register2);
        await save_button.click();

        //Logout
        await browser.url("./logout");
    });

    it("Login", async() => {
        //Logout
        await browser.url("./logout");

        //Click login button in the header
        await $("a.ico-login").click();

        //Fill email and password fields
        await $('[name="Email"]').setValue(Email_login);
        await $('[name="Password"]').setValue(Password);

        //Click login button under fields
        await $("input.button-1.login-button").click();

        //Check that the user is logged in
        const email_link = await $("div.header-links > ul >li a.account")
        await email_link.waitForDisplayed();
        await expect(await email_link.getText()).toEqual(Email_login);
    })

    it("Computers with 3 sub-groups", async() => {
        //Open Computers page
        await browser.url("./computers");

        //Expect 3 sub-groups of Computers(Desktops, Notebooks, Accessories) to exist with correct names
        const subgroups = await $(".sub-category-grid:first-child");
        await expect(await subgroups.getText()).toEqual("Desktops\nNotebooks\nAccessories");
    })

    it("Sorting items", async() => {
        await browser.url("./books");

        //Click sort dropdown
        const sorting_dropdown = await $('[name="products-orderby"]');
        await sorting_dropdown.scrollIntoView();
        await sorting_dropdown.click();

        //Select Name: Z to A
        const order_ZA = await $('[value="https://demowebshop.tricentis.com/books?orderby=6"]');
        await order_ZA.click();

        //Check that the option was selected
        await expect(await order_ZA.getAttribute("selected")).toEqual("true");
        await expect(browser).toHaveUrl("https://demowebshop.tricentis.com/books?orderby=6");

        //Select original option
        const original_order = await $('[value="https://demowebshop.tricentis.com/books?orderby=0"]');
        await original_order.click();
        await expect(await original_order.getAttribute("selected")).toEqual("true");
        await expect(browser).toHaveUrl("https://demowebshop.tricentis.com/books?orderby=0");
    })

    it("Changing number of items per page", async() => {
        await browser.url("./books");

        //Click the Display dropdown
        await $('[name="products-pagesize"]').click();

        //Select 4 items per page
        const order_ZA = await $('[value="https://demowebshop.tricentis.com/books?pagesize=4"]');
        await order_ZA.click();

        //Check that the option was selected
        await expect(await order_ZA.getAttribute("selected")).toEqual("true");
        await expect(browser).toHaveUrl("https://demowebshop.tricentis.com/books?pagesize=4");

        //Select original option
        const original_number = await $('[value="https://demowebshop.tricentis.com/books?pagesize=8"]');
        original_number.click();
        await expect(await original_number.getAttribute("selected")).toEqual("true");
        await expect(browser).toHaveUrl("https://demowebshop.tricentis.com/books?pagesize=8");
    })

    it("Adding an item to Wishlist", async() => {
        //Open an item with Add to wishlist button
        await browser.url("./album-3");

        //Click Add to Wishlist button
        await $('input#add-to-wishlist-button-53').click();

        //Wait for successfully added to the wishlist banner
        await $("div#bar-notification.bar-notification.success").waitForExist(2000);

        //Open wishlist page and check Wishlist counter in the header
        await $('.ico-wishlist').click();
        const wishlist_counter = await $(".wishlist-qty");
        await expect(await wishlist_counter.getText()).toEqual("(1)");

        //Remove item from wishlist
        await $('[name="removefromcart"]').click();
        await $('[name="updatecart"]').click();

        //Wait for updatecart button to disappear
        await $('[name="updatecart"]').waitForDisplayed({ reverse: true });

        //Check that the wishlist is empty
        const wishlist_content = await $(".wishlist-content");
        await expect(await wishlist_content.getText()).toEqual("The wishlist is empty!");
        await expect(await wishlist_counter.getText()).toEqual("(0)");
    })

    it("Adding an item to the cart", async() => {
        //Open a page with Add to cart button
        await browser.url("./casual-belt");

        //Click an Add to cart button
        await $('.button-1.add-to-cart-button').click();

        //Wait for successfully added to the cart banner
        await $("div#bar-notification.bar-notification.success").waitForExist(2000);

        //Open cart and check counter in the header
        //await $('.ico-cart').click();
        const cart_counter = await $(".cart-qty");
        await expect(await cart_counter.getText()).toEqual("(1)");
    })

    it("Removing an item from the cart", async() => {
        await browser.url("./cart");

        //Remove item from cart
        await $('[name="removefromcart"]').click();
        await $('[name="updatecart"]').click();

        //Wait for updatecart button to disappear
        await $('[name="updatecart"]').waitForDisplayed({ reverse: true });
        
        //Check that the cart is empty
        const cart_content = await $(".order-summary-content");
        await expect(await cart_content.getText()).toEqual("Your Shopping Cart is empty!");
    })

    it("Checkout an item", async() => {
        //Add an item to the cart
        await browser.url("./casual-belt");
        await $('.button-1.add-to-cart-button').click();

        //Open cart
        await $('.ico-cart').click();

        //Agree to terms of service
        await $('[name="termsofservice"]').click();

        //Click Checkout
        await $('[name="checkout"]').click();

        //Check Checkout page opened
        const page_title = await $('.page-title');
        await expect(await page_title.getText()).toEqual("Checkout");

        //Remove item from the cart
        await $('.ico-cart').click();
        await $('[name="removefromcart"]').click();
        await $('[name="updatecart"]').click();
    })

})

