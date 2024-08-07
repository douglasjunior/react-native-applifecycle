package com.sample;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Calendar;
import java.util.Date;

public class SecondActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.second);

        Button backButton = findViewById(R.id.back_button);
        backButton.setOnClickListener(v -> {
            finish();
//            startActivity(new Intent(this, MainActivity.class));
        });

        // Calendar cal = Calendar.getInstance();
        // Intent intent = new Intent(this, BackgroundServiceExample.class);
        // intent.putExtra("time", new Date().getTime());
        // PendingIntent pIntent = PendingIntent.getService(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        // AlarmManager alarm = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        // alarm.set(AlarmManager.ELAPSED_REALTIME_WAKEUP,
        //         SystemClock.elapsedRealtime() + 5000, pIntent);
    }

}
