package com.example.backendmap.service;

import com.example.backendmap.entity.Point;
import com.example.backendmap.entity.User;
import com.example.backendmap.payload.LoginDTO;
import com.example.backendmap.payload.RegisterDTO;

import java.util.List;

public interface CommonService {

    String login(LoginDTO loginDTO);

    String register(RegisterDTO registerDTO);

    List<Point> getPoints();
}
