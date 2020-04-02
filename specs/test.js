describe('first e2e tests', () =>{
    beforeEach(() =>{
        //browser.url('/');
    });
    
    it('should have correct title', () =>{
        expect(browser.getTitle()).toEqual('Student Loop');
    });

    // it('automate login with valid credentials', () =>{
    //     browser.url('file://android_asset/www/login.html');
    //  // browser.url('/login');
    //      $("#users_email").setValue("tutor1@dkit.ie");
    //      $("#users_password").setValue("Password1!");
    //    //  $("#login").click();
    //    //  expect(browser.getTitle()).toEqual('Service Loop');
    //    expect($("#users_email")).toEqual("tutor1@dkit.ie");
      // expect(browser.getUrl()).toBe("file:///android_asset/www/login.html");
    
    //});

    // it("should enter login details and submit", () =>{
    //    // browser.pause(10000);
    //     browser.element("//input[@type='email' and @aria-label='users_email']").setValue('tutor1@dkit.ie');
    // })
  
});

