package org.diehl.heuristica.domain.service;

import javax.enterprise.context.ApplicationScoped;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

@ApplicationScoped
public class RandomPointsGenerator {

    private static int maxWidth = 1400;
    private static int maxHeight = 900;

    public double distanceToCenter(int x, int y) {
        return Math.sqrt(Math.pow((double) (x - maxWidth / 2), 2.0D) + Math.pow((double) (y - maxHeight / 2), 2.0D));
    }

    public CompletableFuture<List<Point>> generateRandomPoints() {
        return CompletableFuture.supplyAsync(() -> {
            List<Point> points = new ArrayList<>();
            Random generator = new Random();
            int numberOfPoints = 10000;
            for (int i = 0; i < numberOfPoints; ++i) {
                int x;
                int y;
                int radius = 200;
                do {
                    x = generator.nextInt(maxWidth);
                    y = generator.nextInt(maxHeight);
                    points.add(new Point(x, y));
                } while (distanceToCenter(x, y) >= (double) radius * 1.4D && (distanceToCenter(x, y) >= (double) radius * 1.6D || generator.nextInt(5) != 1) && (distanceToCenter(x, y) >= (double) radius * 1.8D || generator.nextInt(10) != 1) && (maxHeight / 5 >= x || x >= 4 * maxHeight / 5 || maxHeight / 5 >= y || y >= 4 * maxHeight / 5 || generator.nextInt(100) != 1));
            }
            return points;
        });
    }
}
