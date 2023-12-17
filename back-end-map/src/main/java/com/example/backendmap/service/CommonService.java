package com.example.backendmap.service;

import com.example.backendmap.entity.FavPoint;
import com.example.backendmap.entity.NotFavPoint;
import com.example.backendmap.entity.Point;
import com.example.backendmap.entity.PointDTO;
import com.example.backendmap.payload.LoginDTO;
import com.example.backendmap.payload.RegisterDTO;

import java.util.List;

public interface CommonService {

    String login(LoginDTO loginDTO);

    String register(RegisterDTO registerDTO);

    List<Point> getPoints();

    String addPointToUser(List<PointDTO> points, String username);

    String removePointFromUser(List<PointDTO> points, String username);

    List<Point> getFavoritePoint(String username);

    List<Point> getAllPoints();

    String addFavoritePoint(FavPoint favPoint, String username);

    String removeFavoritePoint(NotFavPoint notFavPoint, String username);
}
