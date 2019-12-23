package org.diehl.heuristica.domain.service;

import javax.enterprise.context.ApplicationScoped;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

@ApplicationScoped
public class RandomPointsGenerator {

    private static int maxWidth = 1200;
    private static int maxHeight = 600;

    public double distanceToCenter(int x, int y, float centerWidthRatio) {
        return Math.sqrt(Math.pow((double) (x - maxWidth * centerWidthRatio), 2.0D) + Math.pow((double) (y - maxHeight / 2), 2.0D));
    }

    public CompletableFuture<List<Point>> generateRandomPoints() {
        return CompletableFuture.supplyAsync(() -> {
            List<Point> points = new ArrayList<>();
            Random generator = new Random();
            int numberOfPoints = 1000;
            int i = 0;
            while (i < numberOfPoints) {
                int x;
                int y;
                x = generator.nextInt(maxWidth);
                y = generator.nextInt(maxHeight);
                if ((((distanceToCenter(x, y, 1f / 4f) < 200) || (distanceToCenter(x, y, 3f / 4f) < 200))
                        && ((distanceToCenter(x, y, 1f / 4f) > 210) || (distanceToCenter(x, y, 3f / 4f) > 210))
                        && (distanceToCenter(x, y, 1f / 2f) < 300))
                        || (distanceToCenter(x, y, 1f / 2f) < 200)) {
                    points.add(new Point(x, y));
                    i++;
                }
            }
            return points;
        });
    }
}
