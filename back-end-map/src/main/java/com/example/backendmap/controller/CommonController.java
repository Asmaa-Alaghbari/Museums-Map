package com.example.backendmap.controller;

import com.example.backendmap.entity.Point;
import com.example.backendmap.payload.LoginDTO;
import com.example.backendmap.payload.RegisterDTO;
import com.example.backendmap.service.CommonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CommonController {
    private CommonService commonService;

    public CommonController(CommonService commonService) {
        this.commonService = commonService;
    }

    @PostMapping(value = {"/api/auth/login", "/api/auth/signin"})
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        return new ResponseEntity<>(commonService.login(loginDTO), HttpStatus.OK);
    }

    @PostMapping(value = {"/api/auth/signup", "/api/auth/register"})
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
        return new ResponseEntity<>(commonService.register(registerDTO), HttpStatus.OK);
    }

    @GetMapping(value = "/api/points")
    public ResponseEntity<List<Point>> getPoints() {
        return new ResponseEntity<>(commonService.getPoints(), HttpStatus.OK);
    }
}
