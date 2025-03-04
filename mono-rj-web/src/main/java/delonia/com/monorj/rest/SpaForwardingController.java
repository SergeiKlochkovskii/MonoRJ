package delonia.com.monorj.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController {

    @RequestMapping("/login")
    public String forwardLogin() {
        return "forward:/index.html";
    }

    @RequestMapping("/notfound")
    public String forwardNotFound() {
        return "forward:/index.html";
    }

}

