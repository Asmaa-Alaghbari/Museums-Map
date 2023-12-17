package com.example.backendmap.controller;

import com.example.backendmap.entity.FavPoint;
import com.example.backendmap.entity.NotFavPoint;
import com.example.backendmap.entity.Point;
import com.example.backendmap.entity.PointDTO;
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

    @PostMapping(value = "/api/addPointToUser/{username}")
    public ResponseEntity<String> addPointToUser(@RequestBody List<PointDTO> points, @PathVariable String username) {
        return new ResponseEntity<>(commonService.addPointToUser(points, username), HttpStatus.OK);
    }

    @DeleteMapping(value = "/api/removePointFromUser/{username}")
    public ResponseEntity<String> removePointFromUser(@RequestBody List<PointDTO> points, @PathVariable String username) {
        return new ResponseEntity<>(commonService.removePointFromUser(points, username), HttpStatus.OK);
    }

    @GetMapping(value = "/api/favoritePoint/{username}")
    public ResponseEntity<List<Point>> getFavoritePoint(@PathVariable String username) {
        return new ResponseEntity<>(commonService.getFavoritePoint(username), HttpStatus.OK);
    }

    @GetMapping(value = "/api/allPoints")
    public ResponseEntity<List<Point>> getAllPoints() {
        return new ResponseEntity<>(commonService.getAllPoints(), HttpStatus.OK);
    }

    @PostMapping(value = "/api/addFavoritePoint/{username}")
    public ResponseEntity<String> addFavoritePoint(@RequestBody FavPoint favPoint, @PathVariable String username) {

        return new ResponseEntity<>(commonService.addFavoritePoint(favPoint, username), HttpStatus.OK);
    }

    @PostMapping(value = "/api/removeFavoritePoint/{username}")
    public ResponseEntity<String> removeFavoritePoint(@RequestBody NotFavPoint notFavPoint, @PathVariable String username) {

        return new ResponseEntity<>(commonService.removeFavoritePoint(notFavPoint, username), HttpStatus.OK);
    }
}
